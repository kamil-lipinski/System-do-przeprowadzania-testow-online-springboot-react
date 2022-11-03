package kamil.lipinski.testapp.uzytkownik;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.test.*;
import kamil.lipinski.testapp.pytanie.*;

import java.util.HashMap;
import java.util.Map;

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
    private JwtUserDetailsService userDetailsService;

}
