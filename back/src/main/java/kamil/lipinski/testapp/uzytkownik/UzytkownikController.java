package kamil.lipinski.testapp.uzytkownik;

import kamil.lipinski.testapp.test.TestRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.pula.*;
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

    @GetMapping("/czy_nauczyciel")
    public ResponseEntity<?> czyNauczyciel(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        return ResponseEntity.ok(uzytkownik.isCzyNauczyciel());
    }


}
