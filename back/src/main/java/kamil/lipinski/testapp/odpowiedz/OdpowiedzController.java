package kamil.lipinski.testapp.odpowiedz;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.pula.PulaRepository;
import kamil.lipinski.testapp.pytanie.PytanieRepository;
import kamil.lipinski.testapp.test.TestRepository;
import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import kamil.lipinski.testapp.wynik.WynikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/odpowiedz")
public class OdpowiedzController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private OdpowiedzRepository odpowiedzRepository;

    @Autowired
    private WynikRepository wynikRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PutMapping("/odpowiedz_na_pytanie/")
    public ResponseEntity<?> odpowiedzNaPytanie(@RequestBody HashMap<String, Object> JSON, @RequestParam Long pytanieID) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Odpowiedz nowaOdpowiedz = odpowiedzRepository.findOdpowiedzByPytanieIDAndUzytkownikID(pytanieID, uzytkownik.getUzytkownikID());
        if(testRepository.findTestByTestID(testRepository.findTestByPulaID(
                pytanieRepository.findPytanieByPytanieID(pytanieID).getPula().getPulaID())
                .get(0).getTestID()).getStatus().equals("zakonczony")){
            responseMap.put("error", true);
            responseMap.put("message", "Test został już zakonczony");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(testRepository.findTestByTestID(testRepository.findTestByPulaID(
                        pytanieRepository.findPytanieByPytanieID(pytanieID).getPula().getPulaID())
                .get(0).getTestID()).getStatus().equals("zaplanowany")){
            responseMap.put("error", true);
            responseMap.put("message", "Test jeszcze się nie rozpoczał");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(JSON.get("a") != null){
            nowaOdpowiedz.setA(Boolean.valueOf(JSON.get("a").toString()));
        } else nowaOdpowiedz.setA(false);
        if(JSON.get("b") != null){
            nowaOdpowiedz.setB(Boolean.valueOf(JSON.get("b").toString()));
        } else nowaOdpowiedz.setB(false);
        if(JSON.get("c") != null){
            nowaOdpowiedz.setC(Boolean.valueOf(JSON.get("c").toString()));
        } else nowaOdpowiedz.setC(false);
        if(JSON.get("d") != null){
            nowaOdpowiedz.setD(Boolean.valueOf(JSON.get("d").toString()));
        } else nowaOdpowiedz.setD(false);
        if(JSON.get("e") != null){
            nowaOdpowiedz.setE(Boolean.valueOf(JSON.get("e").toString()));
        } else nowaOdpowiedz.setE(false);
        if(JSON.get("f") != null){
            nowaOdpowiedz.setF(Boolean.valueOf(JSON.get("f").toString()));
        } else nowaOdpowiedz.setF(false);
        odpowiedzRepository.save(nowaOdpowiedz);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie odpowiedziano na pytanie");
        return ResponseEntity.ok(responseMap);
    }
}
