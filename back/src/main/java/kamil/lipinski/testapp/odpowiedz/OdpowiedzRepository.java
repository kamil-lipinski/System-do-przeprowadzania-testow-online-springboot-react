package kamil.lipinski.testapp.odpowiedz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface OdpowiedzRepository extends JpaRepository<Odpowiedz, Long>{

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.pytanieid =:pytanieID AND o.wynikid =:wynikID", nativeQuery = true)
    Odpowiedz findOdpowiedzByPytanieIDAndWynikID(@Param("pytanieID") Long pytanieID, @Param("wynikID") Long wynikID);

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.wynikid =:wynikID", nativeQuery = true)
    ArrayList <Odpowiedz> findOdpowiedzByWynikID(@Param("wynikID") Long wynikID);

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.pytanieid =:pytanieID", nativeQuery = true)
    ArrayList <Odpowiedz> findOdpowiedzByPytanieID(@Param("pytanieID") Long pytanieID);

    @Query(value = "SELECT * FROM odpowiedz o, wynik w WHERE o.wynikid = w.wynikid AND w.uzytkownikid =:uzytkownikID AND w.testid =:testID order by o.numer_pytania", nativeQuery = true)
    ArrayList <Odpowiedz> findOdpowiedzByUzytkownikIDAndTestID(@Param("uzytkownikID") Long uzytkownikID, @Param("testID") Long testID);
}
