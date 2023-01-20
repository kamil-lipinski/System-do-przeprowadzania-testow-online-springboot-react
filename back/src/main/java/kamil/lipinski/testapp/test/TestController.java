package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.odpowiedz.Odpowiedz;
import kamil.lipinski.testapp.odpowiedz.OdpowiedzRepository;
import kamil.lipinski.testapp.pula.PulaRepository;
import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.pytanie.PytanieRepository;
import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import kamil.lipinski.testapp.wynik.Wynik;
import kamil.lipinski.testapp.wynik.WynikRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private WynikRepository wynikRepository;

    @Autowired
    private OdpowiedzRepository odpowiedzRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Scheduled(fixedDelay = 1000, initialDelay = 1000)
    public void scheduledUstawStatusTestu(){
        ArrayList<Test> testy = testRepository.findTestByStatus("zaplanowany");
        ArrayList<Test> testyTrwajace = testRepository.findTestByStatus("trwa");
        testy.addAll(testyTrwajace);
        for(Test t : testy){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String data = t.getData();
            LocalDateTime dataTestu = LocalDateTime.parse(data, formatter);
            LocalDateTime dataZakonczeniaTestu = dataTestu.plusMinutes(t.getCzas());
            LocalDateTime dataTeraz= LocalDateTime.now();
            if(dataTeraz.isAfter(dataTestu) && dataTeraz.isBefore(dataZakonczeniaTestu)){
                t.setStatus("trwa");
                t.setKodDostepu("EXPIRED");
                testRepository.save(t);
            }
            else if(dataTeraz.isAfter(dataZakonczeniaTestu)){
                ArrayList <Wynik> wyniki = wynikRepository.findWynikByTestID(t.getTestID());
                for(Wynik w: wyniki){
                    int punkty = 0;
                    ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(testRepository.findTestByTestID(t.getTestID()).getPula().getPulaID());
                    for(Pytanie p : pytania){
                        Odpowiedz odp = odpowiedzRepository.findOdpowiedzByPytanieIDAndWynikID(p.getPytanieID(),w.getWynikID());
                        if(odp != null){
                            if(odp.getA().equals(p.getAPoprawne()) &&
                                    odp.getB().equals(p.getBPoprawne()) &&
                                    odp.getC().equals(p.getCPoprawne()) &&
                                    odp.getD().equals(p.getDPoprawne()) &&
                                    odp.getE().equals(p.getEPoprawne()) &&
                                    odp.getF().equals(p.getFPoprawne()))punkty++;
                        }
                    }
                    w.setWynik(punkty);
                    wynikRepository.save(w);
                }
                t.setStatus("zakonczony");
                testRepository.save(t);
            }
        }
    }

    @PostMapping("/zaplanuj_test")
    public ResponseEntity<?> zaplanujTest(@RequestBody HashMap<String, Object> JSON){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do zaplanowania testu");
            return ResponseEntity.status(403).body(responseMap); //403 Forbidden
        }
        String [] parameters = {"pulaID", "nazwa", "data", "czas", "iloscPytan"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("message", "Nie wypełniono wszystkich pól");
                return ResponseEntity.status(400).body(responseMap); //400 Bad Request
            }
        }
        String data = JSON.get("data").toString();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime dataTestu = LocalDateTime.parse(data, formatter);
        LocalDateTime dataTeraz= LocalDateTime.now();
        if(dataTestu.isBefore(dataTeraz.plusHours(1))){
            responseMap.put("error", true);
            responseMap.put("message", "Test musi być zaplanowany przynajmniej 1h przed wyznaczoną datą");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        Long pulaID = Long.valueOf(JSON.get("pulaID").toString());
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(pulaID);
        if(pytania.size() < 5){
            responseMap.put("error", true);
            responseMap.put("message", "W puli musi być przynajmniej 5 pytań aby zaplanować test");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String nazwa = JSON.get("nazwa").toString();
        int czas = Integer.valueOf(JSON.get("czas").toString());
        int iloscPytan = Integer.valueOf(JSON.get("iloscPytan").toString());
        if(iloscPytan > pytania.size()){
            responseMap.put("error", true);
            responseMap.put("message", "W puli nie ma tylu pytań.\nIlość pytań w puli: "+pytania.size());
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByKodDostepu(kodDostepu) != null){
            kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        }
        Test nowyTest = new Test(pulaRepository.findPulaByPulaID(pulaID), nazwa, data, czas, iloscPytan, kodDostepu);
        testRepository.save(nowyTest);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyslnie zaplanowano test");
        responseMap.put("kodDostepu", kodDostepu);
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/odwolaj_test/")
    public ResponseEntity<?> odwolajTest(@RequestParam Long testID){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Test test = testRepository.findTestByTestID(testID);
        if(test == null || test.getPula() == null){
            return ResponseEntity.notFound().build();
        }
        if(!(test.getPula().getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID()))){
            return ResponseEntity.notFound().build();
        }
        if(!(test.getStatus().equals("zaplanowany"))){
            responseMap.put("error", true);
            responseMap.put("message", "Test już się zakończył lub własnie trwa");
            return ResponseEntity.status(403).body(responseMap); //403 Forbidden
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime dataTestu = LocalDateTime.parse(test.getData(), formatter);
        LocalDateTime dataTeraz= LocalDateTime.now();
        if(!(dataTestu.isAfter(dataTeraz.plusHours(1)))){
            responseMap.put("error", true);
            responseMap.put("message", "Test można odwołać maksymalnie 1H przed zaplanowanym rozpoczęciem");
            return ResponseEntity.status(403).body(responseMap); //403 Forbidden
        }
        ArrayList<Wynik> wyniki = wynikRepository.findWynikByTestID(testID);
        for(Wynik w : wyniki){
            ArrayList<Odpowiedz> odpowidzi = odpowiedzRepository.findOdpowiedzByWynikID(w.getWynikID());
            for(Odpowiedz o : odpowidzi){
                odpowiedzRepository.delete(o);
            }
            wynikRepository.delete(w);
        }
        testRepository.delete(test);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie odwołano test");
        return ResponseEntity.ok(responseMap);
    }

    @PostMapping("/zapisz_sie_na_test")
    public ResponseEntity<?> zapiszSieNaTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(JSON.get("kodDostepu") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "Nie podano kodu dostępu");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String kodDostepu = JSON.get("kodDostepu").toString();
        if(testRepository.findTestByKodDostepu(kodDostepu) == null || kodDostepu == "EXPIRED"){
            responseMap.put("error", true);
            responseMap.put("message", "Kod dostępu wygasł lub jest niepoprawny");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        Test test = testRepository.findTestByKodDostepu(kodDostepu);
        if(wynikRepository.findWynikByTestIDAndUzytkownikID(
                test.getTestID(),uzytkownik.getUzytkownikID()) != null){
            responseMap.put("error", true);
            responseMap.put("message", "Użytkownik jest juz zapisany na ten test");
            return ResponseEntity.status(409).body(responseMap); //409 Conflict
        }
        Wynik nowyWynik = new Wynik(uzytkownik, test);
        wynikRepository.save(nowyWynik);
        int iloscPytan = test.getIloscPytan();
        int numerPytania = 1;
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(test.getPula().getPulaID());
        while (iloscPytan != 0){
            Random rand = new Random();
            int n = rand.nextInt(pytania.size());
            Odpowiedz nowaOdpowiedz = new Odpowiedz(pytania.get(n),nowyWynik,numerPytania);
            odpowiedzRepository.save(nowaOdpowiedz);
            pytania.remove(n);
            numerPytania++;
            iloscPytan--;
        }
        test.setIloscZapisanych(test.getIloscZapisanych()+1);
        testRepository.save(test);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie zapisano na test");
        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/zakoncz_test/")
    public ResponseEntity<?> zakonczTest(@RequestParam Long testID) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Wynik wynik = wynikRepository.findWynikByTestIDAndUzytkownikID(testID, uzytkownik.getUzytkownikID());
        if(testRepository.findTestByTestID(testID) == null){
            return ResponseEntity.notFound().build();
        }
        if(wynik == null){
            return ResponseEntity.notFound().build();
        }
        int punkty = 0;
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(testRepository.findTestByTestID(testID).getPula().getPulaID());
        for(Pytanie p : pytania){
            Odpowiedz odp = odpowiedzRepository.findOdpowiedzByPytanieIDAndWynikID(p.getPytanieID(),wynik.getWynikID());
            if(odp != null){
                if(odp.getA().equals(p.getAPoprawne()) &&
                        odp.getB().equals(p.getBPoprawne()) &&
                        odp.getC().equals(p.getCPoprawne()) &&
                        odp.getD().equals(p.getDPoprawne()) &&
                        odp.getE().equals(p.getEPoprawne()) &&
                        odp.getF().equals(p.getFPoprawne()))punkty++;
            }
        }
        wynik.setWynik(punkty);
        wynikRepository.save(wynik);
        int max = testRepository.findTestByTestID(testID).getIloscPytan();
        responseMap.put("error", false);
        responseMap.put("message", "Zakonczono test. Wynik testu: " +punkty +"/" +max);
        responseMap.put("wynik", punkty);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/wyswietl_pytania_do_testu/")
    public ResponseEntity<?> wyswietlPytania(@RequestParam Long testID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Wynik wynik = wynikRepository.findWynikByTestIDAndUzytkownikID(testID, uzytkownik.getUzytkownikID());
        if(testRepository.findTestByTestID(testID) == null){
            return ResponseEntity.notFound().build();
        }
        if(wynik == null){
            return ResponseEntity.notFound().build();
        }
        ArrayList<Pytanie> pytaniaUzytkownika = new ArrayList<>();
        ArrayList<Odpowiedz> odp = odpowiedzRepository.findOdpowiedzByWynikID(wynik.getWynikID());
        for(Odpowiedz o : odp){
            Pytanie pytanie = pytanieRepository.findPytanieByPytanieID(o.getPytanie().getPytanieID());
            pytanie.setPula(null);
            pytanie.setAPoprawne(null);
            pytanie.setBPoprawne(null);
            pytanie.setCPoprawne(null);
            pytanie.setDPoprawne(null);
            pytanie.setEPoprawne(null);
            pytanie.setFPoprawne(null);
            pytaniaUzytkownika.add(pytanie);
        }
        return ResponseEntity.ok(pytaniaUzytkownika);
    }

    @GetMapping("/wyswietl_testy_zaplanowane_n")
    public ResponseEntity<?> wyswietlTestyZaplanowaneN(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDN(uzytkownik.getUzytkownikID(),"zaplanowany");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_testy_trwajace_n")
    public ResponseEntity<?> wyswietlTestyTrwajaceN(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDN(uzytkownik.getUzytkownikID(),"trwa");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_testy_zakonczone_n")
    public ResponseEntity<?> wyswietlTestyZakonczoneN(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDN(uzytkownik.getUzytkownikID(),"zakonczony");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_testy_zaplanowane_u")
    public ResponseEntity<?> wyswietlTestyZaplanowaneU(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDU(uzytkownik.getUzytkownikID(),"zaplanowany");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_testy_trwajace_u")
    public ResponseEntity<?> wyswietlTestyTrwajaceU(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDU(uzytkownik.getUzytkownikID(),"trwa");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_testy_zakonczone_u")
    public ResponseEntity<?> wyswietlTestyZakonczoneU(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Test> testy = testRepository.findTestByUzytkownikIDU(uzytkownik.getUzytkownikID(),"zakonczony");
        return ResponseEntity.ok(testy);
    }

    @GetMapping("/wyswietl_test/")
    public ResponseEntity<?> wyswietlTest(@RequestParam Long testID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Test test = testRepository.findTestByTestID(testID);
        if(test == null || test.getPula() == null){
            return ResponseEntity.notFound().build();
        }
        if(wynikRepository.findWynikByTestIDAndUzytkownikID(testID,uzytkownik.getUzytkownikID()) == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(test);
    }
}
