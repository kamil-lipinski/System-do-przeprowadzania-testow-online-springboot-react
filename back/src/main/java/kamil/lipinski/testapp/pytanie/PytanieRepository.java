package kamil.lipinski.testapp.pytanie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PytanieRepository extends JpaRepository<Pytanie, Long> {
    @Query(value = "SELECT * FROM pytanie p WHERE p.pytanieid =:pytanieID", nativeQuery = true)
    Pytanie findPytanieByPytanieID(@Param("pytanieID") Long testID);

}
