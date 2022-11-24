package kamil.lipinski.testapp.uzytkownik;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.test.*;
import kamil.lipinski.testapp.pytanie.*;
import kamil.lipinski.testapp.odpowiedz.*;
import kamil.lipinski.testapp.wynik.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/uzytkownik")
public class UzytkownikController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private OdpowiedzRepository odpowiedzRepository;

    @Autowired
    private WynikRepository wynikRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/zapisz_sie_na_test")
    public ResponseEntity<?> zapiszSieNaTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (JSON.get("kodDostepu") == null) {
            responseMap.put("error", true);
            responseMap.put("massage", "Nie podano kodu dostępu");
            return ResponseEntity.status(500).body(responseMap);
        }
        String kodDostepu = JSON.get("kodDostepu").toString();
        if(testRepository.findTestByKodDostepu(kodDostepu) == null){
            responseMap.put("error", true);
            responseMap.put("massage", "Kod dostępu niepoprawny");
            return ResponseEntity.status(500).body(responseMap);
        }
        Wynik nowyWynik = new Wynik(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()), testRepository.findTestByKodDostepu(kodDostepu));
        wynikRepository.save(nowyWynik);
        int iloscPytan = testRepository.findTestByKodDostepu(kodDostepu).getIloscPytan();
        int numerPytania = 1;
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByTestID(testRepository.findTestByKodDostepu(kodDostepu).getTestID());
        while (iloscPytan != 0){
            Random rand = new Random();
            int n = rand.nextInt(pytania.size());
            Odpowiedz nowaOdpowiedz = new Odpowiedz(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()),pytania.get(n),numerPytania);
            odpowiedzRepository.save(nowaOdpowiedz);
            pytania.remove(n);
            numerPytania++;
            iloscPytan--;
        }
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie zapisano na test");
        return ResponseEntity.ok(responseMap);
    }
}
