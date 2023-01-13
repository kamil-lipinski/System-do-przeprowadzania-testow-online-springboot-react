package kamil.lipinski.testapp.wynik;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.odpowiedz.OdpowiedzRepository;
import kamil.lipinski.testapp.pula.PulaRepository;
import kamil.lipinski.testapp.pytanie.PytanieRepository;
import kamil.lipinski.testapp.test.TestRepository;
import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/wyswietl_wynik_u/")
    public ResponseEntity<?> wyswietlWynikU(@RequestParam Long testID){
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

    @GetMapping("/wyswietl_wyniki_u")
    public ResponseEntity<?> wyswietlWynikiU(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Wynik> wyniki = wynikRepository.findWynikByUzytkownikID(uzytkownik.getUzytkownikID());
        if(wyniki == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wyniki);
    }

    @GetMapping("/wyswietl_wyniki_n")
    public ResponseEntity<?> wyswietlWynikiN(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Wynik> wyniki = wynikRepository.findWynikByUzytkownikIDN(uzytkownik.getUzytkownikID());
        if(wyniki == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wyniki);
    }

    @GetMapping("/wyswietl_wyniki_n2/")
    public ResponseEntity<?> wyswietlWynikN(@RequestParam Long testID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        ArrayList<Wynik> wyniki = wynikRepository.findWynikByTestID(testID);
        if(wyniki == null){
            return ResponseEntity.notFound().build();
        }
        if(!testRepository.findTestByTestID(testID).getPula().getUzytkownik().getUzytkownikID().equals(uzytkownik.getUzytkownikID())){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wyniki);
    }
}
