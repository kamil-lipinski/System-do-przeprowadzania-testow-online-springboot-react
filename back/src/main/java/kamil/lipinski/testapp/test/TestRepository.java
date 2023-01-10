package kamil.lipinski.testapp.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface TestRepository extends JpaRepository<Test, Long> {
    @Query(value = "SELECT * FROM test t WHERE t.testid =:testID", nativeQuery = true)
    Test findTestByTestID(@Param("testID") Long testID);

    @Query(value = "SELECT * FROM test t WHERE t.kod_dostepu =:kodDostepu", nativeQuery = true)
    Test findTestByKodDostepu(@Param("kodDostepu") String kodDostepu);

    @Query(value = "SELECT * FROM test t WHERE t.pulaid =:pulaID", nativeQuery = true)
    ArrayList<Test> findTestByPulaID(@Param("pulaID") Long pulaID);

    @Query(value = "SELECT * FROM test t WHERE t.status =:status", nativeQuery = true)
    ArrayList<Test> findTestByStatus(@Param("status") String status);

    @Query(value = "SELECT * FROM test t, pula p WHERE t.pulaid = p.pulaid AND t.status =:status AND p.uzytkownikid =:uzytkownikID", nativeQuery = true)
    ArrayList<Test> findTestByUzytkownikIDN(@Param("uzytkownikID") Long uzytkownikID, @Param("status") String status);

    @Query(value = "SELECT * FROM test t, wynik w WHERE t.testid = w.testid AND t.status =:status AND w.uzytkownikid =:uzytkownikID", nativeQuery = true)
    ArrayList<Test> findTestByUzytkownikIDU(@Param("uzytkownikID") Long uzytkownikID, @Param("status") String status);
}
