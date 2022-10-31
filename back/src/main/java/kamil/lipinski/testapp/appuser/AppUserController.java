package kamil.lipinski.testapp.appuser;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.test.*;
import kamil.lipinski.testapp.question.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/api")
public class AppUserController {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping(path="/createtest")
    public @ResponseBody ResponseEntity<?> createTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(appUserRepository.findAppUserByEmail(authentication.getName()).isTeacher())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia testow");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(JSON.get("name") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "nie podano nazwy");
            return ResponseEntity.status(500).body(responseMap);
        }
        String name = JSON.get("name").toString();
        String accesCode = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByAccesCode(accesCode) != null){
            accesCode = RandomStringUtils.randomAlphanumeric(5);
        }
        Test newTest = new Test(appUserRepository.findAppUserByEmail(authentication.getName()), name, accesCode);
        testRepository.save(newTest);
        responseMap.put("error", false);
        responseMap.put("message", "Test created successfully");
        return ResponseEntity.ok(responseMap);
    }

    @PostMapping(path="/addquestion")
    public ResponseEntity<?> addQuestion(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(appUserRepository.findAppUserByEmail(authentication.getName()).isTeacher())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do dodawania pytań");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"testID", "question", "a", "aCorrect", "b", "bCorrect"};
        for(String i : parameters)
            if(JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("massage", "nie podano wszystkich wymaganych pol, nalezy podac przynajmniej 2 odpowiedzi");
                return ResponseEntity.status(500).body(responseMap);
            }
        Long testID = Long.valueOf(JSON.get("testID").toString());
        String question = JSON.get("question").toString();
        String a = JSON.get("a").toString();
        Boolean aCorrect = Boolean.valueOf(JSON.get("aCorrect").toString());
        String b = JSON.get("b").toString();
        Boolean bCorrect = Boolean.valueOf(JSON.get("bCorrect").toString());
        if(!(testRepository.findTestByTestID(testID).getAppUser().getUserID().equals(appUserRepository.findAppUserByEmail(authentication.getName()).getUserID()))){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do dodawania pytań do testu o id: "+testID);
            return ResponseEntity.status(500).body(responseMap);
        }
        Question newQuestion = new Question();
        newQuestion.setTest(testRepository.findTestByTestID(testID));
        newQuestion.setQuestion(question);
        newQuestion.setA(a);
        newQuestion.setACorrect(aCorrect);
        newQuestion.setB(b);
        newQuestion.setBCorrect(bCorrect);
        if(JSON.get("c") != null){
            newQuestion.setC(JSON.get("c").toString());
            newQuestion.setCCorrect(Boolean.valueOf(JSON.get("cCorrect").toString()));
        }
        if(JSON.get("d") != null){
            newQuestion.setD(JSON.get("d").toString());
            newQuestion.setDCorrect(Boolean.valueOf(JSON.get("dCorrect").toString()));
        }
        if(JSON.get("e") != null){
            newQuestion.setE(JSON.get("e").toString());
            newQuestion.setECorrect(Boolean.valueOf(JSON.get("eCorrect").toString()));
        }
        if(JSON.get("f") != null){
            newQuestion.setF(JSON.get("f").toString());
            newQuestion.setFCorrect(Boolean.valueOf(JSON.get("fCorrect").toString()));
        }
        questionRepository.save(newQuestion);
        responseMap.put("error", false);
        responseMap.put("massage", "Pomyslnie dodano pytanie");
        return ResponseEntity.ok(responseMap);
    }



}
