package kamil.lipinski.testapp.odpowiedz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface OdpowiedzRepository extends JpaRepository<Odpowiedz, Long>{
    @Query(value = "SELECT * FROM odpowiedz o WHERE o.pytanieid =:pytanieID", nativeQuery = true)
    ArrayList<Odpowiedz> findOdpowiedzByPytanieID(@Param("pytanieID") Long pytanieID);

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.pytanieid =:pytanieID AND o.uzytkownikid =:uzytkownikID AND o.wynikid =:wynikID", nativeQuery = true)
    Odpowiedz findOdpowiedzByPytanieIDUzytkownikIDAndWynikID(@Param("pytanieID") Long pytanieID, @Param("uzytkownikID") Long uzytkownikID, @Param("wynikID") Long wynikID);
}
