package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.odpowiedz.Odpowiedz;
import kamil.lipinski.testapp.odpowiedz.OdpowiedzRepository;
import kamil.lipinski.testapp.pula.Pula;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

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

    @PostMapping("/zaplanuj_test")
    public ResponseEntity<?> zaplanujTest(@RequestBody HashMap<String, Object> JSON){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do zaplanowania testu");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"pulaID", "nazwa", "data", "czas", "iloscPytan"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("message", "Nie podano wszystkich wymaganych pól");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        Long pulaID = Long.valueOf(JSON.get("pulaID").toString());
        String nazwa = JSON.get("nazwa").toString();
        String data = JSON.get("data").toString();
        int czas = Integer.valueOf(JSON.get("czas").toString());
        int iloscPytan = Integer.valueOf(JSON.get("iloscPytan").toString());
        String kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByKodDostepu(kodDostepu) != null){
            kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        }
        Test nowyTest = new Test(pulaRepository.findPulaByPulaID(pulaID), nazwa, data, czas, iloscPytan, kodDostepu);
        testRepository.save(nowyTest);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyslnie zaplanowano test");
        return ResponseEntity.ok(responseMap);
    }

    @PostMapping("/zapisz_sie_na_test")
    public ResponseEntity<?> zapiszSieNaTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if (JSON.get("kodDostepu") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "Nie podano kodu dostępu");
            return ResponseEntity.status(500).body(responseMap);
        }
        String kodDostepu = JSON.get("kodDostepu").toString();
        if(testRepository.findTestByKodDostepu(kodDostepu) == null || kodDostepu == "EXPIRED"){
            responseMap.put("error", true);
            responseMap.put("message", "Kod dostępu niepoprawny");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(wynikRepository.findWynikByTestIDAndUzytkownikID(
                testRepository.findTestByKodDostepu(kodDostepu).getTestID(),uzytkownik.getUzytkownikID()) != null){
            responseMap.put("error", true);
            responseMap.put("message", "Użytkownik jest juz zapisany na ten test");
            return ResponseEntity.status(500).body(responseMap);
        }
        Wynik nowyWynik = new Wynik(uzytkownik, testRepository.findTestByKodDostepu(kodDostepu));
        wynikRepository.save(nowyWynik);
        int iloscPytan = testRepository.findTestByKodDostepu(kodDostepu).getIloscPytan();
        int numerPytania = 1;
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(testRepository.findTestByKodDostepu(kodDostepu).getPula().getPulaID());
        while (iloscPytan != 0){
            Random rand = new Random();
            int n = rand.nextInt(pytania.size());
            Odpowiedz nowaOdpowiedz = new Odpowiedz(uzytkownik,pytania.get(n),numerPytania);
            odpowiedzRepository.save(nowaOdpowiedz);
            pytania.remove(n);
            numerPytania++;
            iloscPytan--;
        }
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie zapisano na test");
        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/zakoncz_test/")
    public ResponseEntity<?> zakonczTest(@RequestParam Long testID) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(testRepository.findTestByTestID(testID) == null){
            return ResponseEntity.notFound().build();
        }
        if(!(wynikRepository.findWynikByTestIDAndUzytkownikID(testID, uzytkownik.getUzytkownikID()).getUzytkownik()
                .getUzytkownikID().equals(uzytkownik.getUzytkownikID()))){
            return ResponseEntity.notFound().build();
        }
        int punkty = 0;
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(testRepository.findTestByTestID(testID).getPula().getPulaID());
        for(Pytanie p : pytania){
            Odpowiedz odp = odpowiedzRepository.findOdpowiedzByPytanieIDAndUzytkownikID(p.getPytanieID(),uzytkownik.getUzytkownikID());
            if(odp != null){
                if(odp.getA().equals(p.getAPoprawne()) &&
                        odp.getB().equals(p.getBPoprawne()) &&
                        odp.getC().equals(p.getCPoprawne()) &&
                        odp.getD().equals(p.getDPoprawne()) &&
                        odp.getE().equals(p.getEPoprawne()) &&
                        odp.getF().equals(p.getFPoprawne()))punkty++;
            }
        }
        Wynik nowyWynik = wynikRepository.findWynikByTestIDAndUzytkownikID(testID, uzytkownik.getUzytkownikID());
        nowyWynik.setWynik(punkty);
        Test nowytest = testRepository.findTestByTestID(testID);
        nowytest.setCzyZakonczony(true);
        wynikRepository.save(nowyWynik);
        testRepository.save(nowytest);
        int max = testRepository.findTestByTestID(testID).getIloscPytan();
        responseMap.put("error", false);
        responseMap.put("message", "Zakonczono test. Wynik testu: " +punkty +"/" +max);
        responseMap.put("wynik", punkty);
        return ResponseEntity.ok(responseMap);
    }

    @Scheduled(fixedDelay = 1000, initialDelay = 1000)
    public void scheduledZakonczTest(){
        ArrayList<Test> testy = testRepository.findTestNieZakonczony();
        for(Test t : testy){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String data = t.getData();
            LocalDateTime dataTestu = LocalDateTime.parse(data, formatter);
            LocalDateTime dataZakonczeniaTestu = dataTestu.plusMinutes(t.getCzas());
            LocalDateTime dateTeraz= LocalDateTime.now();
            if(dateTeraz.isAfter(dataZakonczeniaTestu)){
                ArrayList <Wynik> wyniki = wynikRepository.findWynikByTestID(t.getTestID());
                for(Wynik w: wyniki){
                    int punkty = 0;
                    ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(testRepository.findTestByTestID(t.getTestID()).getPula().getPulaID());
                    for(Pytanie p : pytania){
                        Odpowiedz odp = odpowiedzRepository.findOdpowiedzByPytanieIDAndUzytkownikID(p.getPytanieID(),w.getUzytkownik().getUzytkownikID());
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
            }
            t.setCzyZakonczony(true);
            t.setKodDostepu("EXPIRED");
            testRepository.save(t);
        }
    }
}
