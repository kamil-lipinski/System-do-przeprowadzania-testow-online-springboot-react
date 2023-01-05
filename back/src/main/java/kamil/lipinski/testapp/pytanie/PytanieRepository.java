package kamil.lipinski.testapp.pytanie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface PytanieRepository extends JpaRepository<Pytanie, Long> {
    @Query(value = "SELECT * FROM pytanie p WHERE p.pytanieid =:pytanieID", nativeQuery = true)
    Pytanie findPytanieByPytanieID(@Param("pytanieID") Long pytanieID);

    @Query(value = "SELECT * FROM pytanie p WHERE p.pulaid =:pulaID", nativeQuery = true)
    ArrayList<Pytanie> findPytanieByPulaID(@Param("pulaID") Long pulaID);

    @Query(value = "SELECT * FROM pytanie p WHERE p.pulaid =:pulaID ORDER BY p.pytanieid desc", nativeQuery = true)
    ArrayList<Pytanie> findPytanieByPulaIDOrderByPytanieIDDesc(@Param("pulaID") Long pulaID);

}
