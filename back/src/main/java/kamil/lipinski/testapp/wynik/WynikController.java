package kamil.lipinski.testapp.wynik;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.odpowiedz.Odpowiedz;
import kamil.lipinski.testapp.odpowiedz.OdpowiedzRepository;
import kamil.lipinski.testapp.pula.Pula;
import kamil.lipinski.testapp.pula.PulaRepository;
import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.pytanie.PytanieRepository;
import kamil.lipinski.testapp.test.TestRepository;
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
@RequestMapping("/wynik")
public class WynikController {

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

    @GetMapping("/wyswietl_wynik/")
    public ResponseEntity<?> wyswietlWynik(@RequestParam Long testID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        Wynik wynik = wynikRepository.findWynikByTestIDAndUzytkownikID(testID, uzytkownik.getUzytkownikID());
        if(wynik == null){
            return ResponseEntity.notFound().build();
        }
        if(!wynik.getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wynik);
    }
}
