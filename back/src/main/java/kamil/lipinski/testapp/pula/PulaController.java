package kamil.lipinski.testapp.pula;

import kamil.lipinski.testapp.odpowiedz.Odpowiedz;
import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.test.Test;
import kamil.lipinski.testapp.test.TestRepository;
import kamil.lipinski.testapp.wynik.Wynik;
import org.apache.commons.lang3.RandomStringUtils;
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
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/stworz_pule")
    public @ResponseBody ResponseEntity<?> stworzPule(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia pul pytań");
            return ResponseEntity.status(403).body(responseMap); //403 Forbidden
        }
        if (JSON.get("nazwa") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "Nie podano nazwy testu");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String nazwa = JSON.get("nazwa").toString();
        Pula nowaPula = new Pula(uzytkownik, nazwa);
        pulaRepository.save(nowaPula);
        responseMap.put("error", false);
        responseMap.put("message", "Pula utworzona pomyslnie");
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
                responseMap.put("message", "Nie można usunąć puli z pytaniami z której trwają lub są zaplanowane testy");
                return ResponseEntity.status(403).body(responseMap); //403 Forbidden
            }
            t.setPula(null);
            testRepository.save(t);
        }
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(pulaID);
        for(Pytanie p : pytania){
            p.setPula(null);
            pytanieRepository.save(p);
        }
        pulaRepository.delete(pulaRepository.findPulaByPulaID(pulaID));
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie usunieto pulę pytań");
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
            responseMap.put("message", "Nie nowej nazwy");
            return ResponseEntity.status(400).body(responseMap); //400 Bad Request
        }
        String nazwa = JSON.get("nazwa").toString();
        pula.setNazwa(nazwa);
        pulaRepository.save(pula);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyslnie edytowano pytanie");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/wyswietl_pytania/")
    public ResponseEntity<?> wyswietlPytania(@RequestParam Long pulaID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Pula pula = pulaRepository.findPulaByPulaID(pulaID);
        if(pula == null){
            return ResponseEntity.notFound().build();
        }
        if(!pula.getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(pulaID);
        return ResponseEntity.ok(pytania);
    }

    @GetMapping("/wyswietl_pule")
    public ResponseEntity<?> wyswietlPule(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Pula> pule = pulaRepository.findPulaByUzytkownikID(uzytkownik.getUzytkownikID());
        return ResponseEntity.ok(pule);
    }
}
