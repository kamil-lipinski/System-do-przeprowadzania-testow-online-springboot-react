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

    @Query(value = "SELECT * FROM test t WHERE t.czy_zakonczony = false", nativeQuery = true)
    ArrayList<Test> findTestNieZakonczony();

    @Query(value = "SELECT * FROM test t WHERE t.czy_zakonczony = true", nativeQuery = true)
    ArrayList<Test> findTestZakonczony();
}
