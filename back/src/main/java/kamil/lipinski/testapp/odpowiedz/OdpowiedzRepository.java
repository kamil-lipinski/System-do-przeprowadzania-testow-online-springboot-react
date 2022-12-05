package kamil.lipinski.testapp.odpowiedz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;

public interface OdpowiedzRepository extends JpaRepository<Odpowiedz, Long>{

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.pytanieid =:pytanieID AND o.uzytkownikid =:uzytkownikID AND o.wynikid =:wynikID", nativeQuery = true)
    Odpowiedz findOdpowiedzByPytanieIDUzytkownikIDAndWynikID(@Param("pytanieID") Long pytanieID, @Param("uzytkownikID") Long uzytkownikID, @Param("wynikID") Long wynikID);

    @Query(value = "SELECT * FROM odpowiedz o WHERE o.uzytkownikid =:uzytkownikID AND o.wynikid =:wynikID order by o.numer_pytania", nativeQuery = true)
    ArrayList <Odpowiedz> findOdpowiedzByUzytkownikIDAndWynikID(@Param("uzytkownikID") Long uzytkownikID, @Param("wynikID") Long wynikID);
}
