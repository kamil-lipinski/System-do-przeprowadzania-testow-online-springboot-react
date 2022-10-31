package kamil.lipinski.testapp.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestRepository extends JpaRepository<Test, Long> {
    @Query(value = "SELECT * FROM test t WHERE t.testid =:testID", nativeQuery = true)
    Test findTestByTestID(@Param("testID") Long testID);

    @Query(value = "SELECT * FROM test t WHERE t.acces_code =:accesCode", nativeQuery = true)
    Test findTestByAccesCode(@Param("accesCode") String accesCode);
}
