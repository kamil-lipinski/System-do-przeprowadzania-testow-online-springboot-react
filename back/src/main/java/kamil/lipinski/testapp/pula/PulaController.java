package kamil.lipinski.testapp.pula;

import kamil.lipinski.testapp.odpowiedz.Odpowiedz;
import kamil.lipinski.testapp.odpowiedz.OdpowiedzRepository;
import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.test.Test;
import kamil.lipinski.testapp.test.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.uzytkownik.*;
import kamil.lipinski.testapp.pytanie.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/pula")
public class PulaController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private OdpowiedzRepository odpowiedzRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/stworz_pule")
    public @ResponseBody ResponseEntity<?> stworzPule() {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "Uzytkownik nie ma uprawnień do tworzenia pul pytań");
            return ResponseEntity.status(403).body(responseMap); //403 Forbidden
        }
        Pula nowaPula = new Pula(uzytkownik, "Nowa pula");
        pulaRepository.save(nowaPula);
        responseMap.put("error", false);
        responseMap.put("message", "Utworzono nową pulę pytań");
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/usun_pule/")
    public ResponseEntity<?> usunPule(@RequestParam Long pulaID){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Pula pula = pulaRepository.findPulaByPulaID(pulaID);
        if(pula == null){
            return ResponseEntity.notFound().build();
        }
        if(!pula.getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        ArrayList<Test> testy = testRepository.findTestByPulaID(pulaID);
        for(Test t : testy){
            if(!(t.getStatus().equals("zakonczony"))){
                responseMap.put("error", true);
                responseMap.put("message", "Nie można usunąć puli do której trwają lub są zaplanowane testy");
                return ResponseEntity.status(403).body(responseMap); //403 Forbidden
            }
        }
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(pulaID);
        for(Pytanie p : pytania){
            ArrayList<Odpowiedz> odpowiedzi = odpowiedzRepository.findOdpowiedzByPytanieID(p.getPytanieID());
            for(Odpowiedz o : odpowiedzi){
                odpowiedzRepository.delete(o);
            }
            pytanieRepository.delete(p);
        }
        pula.setCzyZarchiwizowana(true);
        pulaRepository.save(pula);
        responseMap.put("error", false);
        responseMap.put("message", "Usunięto pulę pytań");
        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/zmien_nazwe/")
    public ResponseEntity<?> zmienNazwe(@RequestBody HashMap<String, Object> JSON, @RequestParam Long pulaID){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Pula pula = pulaRepository.findPulaByPulaID(pulaID);
        if(pula == null){
            return ResponseEntity.notFound().build();
        }
        if(!pula.getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        if (JSON.get("nazwa") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "Nie podano nazwy");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String nazwa = JSON.get("nazwa").toString();
        pula.setNazwa(nazwa);
        pulaRepository.save(pula);
        responseMap.put("error", false);
        responseMap.put("message", "Nazwa puli została zmieniona");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/wyswietl_pytania/")
    public ResponseEntity<?> wyswietlPytania(@RequestParam Long pulaID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Pula pula = pulaRepository.findPulaByPulaID(pulaID);
        if(pula == null || pula.isCzyZarchiwizowana()){
            return ResponseEntity.notFound().build();
        }
        if(!pula.getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaIDOrderByPytanieIDDesc(pulaID);
        return ResponseEntity.ok(pytania);
    }

    @GetMapping("/wyswietl_pule")
    public ResponseEntity<?> wyswietlPule(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Pula> pule = pulaRepository.findPulaByUzytkownikIDOrderByPulaIDDesc(uzytkownik.getUzytkownikID());
        return ResponseEntity.ok(pule);
    }

    @GetMapping("/info")
    public ResponseEntity<?> pulaInfo(@RequestParam Long pulaID){
        Map<String, Object> responseMap = new HashMap<>();
        Pula pula = pulaRepository.findPulaByPulaID(pulaID);
        responseMap.put("error", false);
        responseMap.put("nazwa", pula.getNazwa());
        responseMap.put("iloscPytan", pula.getIloscPytan());
        return ResponseEntity.ok(responseMap);
    }
}
