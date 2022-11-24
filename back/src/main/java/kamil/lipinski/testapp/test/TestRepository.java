package kamil.lipinski.testapp.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestRepository extends JpaRepository<Test, Long> {
    @Query(value = "SELECT * FROM test t WHERE t.testid =:testID", nativeQuery = true)
    Test findTestByTestID(@Param("testID") Long testID);

    @Query(value = "SELECT * FROM test t WHERE t.kod_dostepu =:kodDostepu", nativeQuery = true)
    Test findTestByKodDostepu(@Param("kodDostepu") String kodDostepu);
}
