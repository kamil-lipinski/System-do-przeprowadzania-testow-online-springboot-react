package kamil.lipinski.testapp.pula;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface PulaRepository extends JpaRepository<Pula, Long> {
    @Query(value = "SELECT * FROM pula p WHERE p.pulaid =:pulaID", nativeQuery = true)
    Pula findPulaByPulaID(@Param("pulaID") Long pulaID);

    @Query(value = "SELECT * FROM pula p WHERE p.uzytkownikid =:uzytkownikID", nativeQuery = true)
    ArrayList<Pula> findPulaByUzytkownikID(@Param("uzytkownikID") Long uzytkownikID);

    @Query(value = "SELECT * FROM pula p WHERE p.uzytkownikid =:uzytkownikID ORDER BY p.pulaid desc", nativeQuery = true)
    ArrayList<Pula> findPulaByUzytkownikIDOrderByPulaIDDesc(@Param("uzytkownikID") Long uzytkownikID);
}
