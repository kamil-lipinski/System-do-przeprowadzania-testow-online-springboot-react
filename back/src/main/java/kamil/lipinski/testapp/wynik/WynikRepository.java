package kamil.lipinski.testapp.wynik;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface WynikRepository extends JpaRepository<Wynik, Long>{
    @Query(value = "SELECT * FROM wynik w WHERE w.testid =:testID", nativeQuery = true)
    ArrayList<Wynik> findWynikByTestID(@Param("testID") Long testID);

    @Query(value = "SELECT * FROM wynik w WHERE w.testid =:testID AND w.uzytkownikid =:uzytkownikID", nativeQuery = true)
    Wynik findWynikByTestIDAndUzytkownikID(@Param("testID") Long testID, @Param("uzytkownikID") Long uzytkownikID);
}
