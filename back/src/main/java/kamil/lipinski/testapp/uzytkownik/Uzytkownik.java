package kamil.lipinski.testapp.uzytkownik;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Uzytkownik {
    @Id
    @SequenceGenerator(
            name = "uzytkownikIDSequence",
            sequenceName = "uzytkownikIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "uzytkownikIDSequence"
    )
    private Long uzytkownikID;
    private String imie;
    private String nazwisko;
    private String email;
    private String haslo;
    private boolean czyNauczyciel;

    public Uzytkownik(String imie, String nazwisko, String email, String haslo, boolean czyNauczyciel) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.email = email;
        this.haslo = haslo;
        this.czyNauczyciel = czyNauczyciel;
    }

}
