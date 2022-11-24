package kamil.lipinski.testapp.pula;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PulaRepository extends JpaRepository<Pula, Long> {
    @Query(value = "SELECT * FROM pula p WHERE p.pulaid =:pulaID", nativeQuery = true)
    Pula findPulaByPulaID(@Param("pulaID") Long pulaID);
}
