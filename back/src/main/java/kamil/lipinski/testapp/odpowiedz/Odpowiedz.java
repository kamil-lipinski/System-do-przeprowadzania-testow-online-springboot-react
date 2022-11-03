package kamil.lipinski.testapp.odpowiedz;

import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.pytanie.Pytanie;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Odpowiedz {
    @Id
    @SequenceGenerator(
            name = "odpowiedzIDSequence",
            sequenceName = "odpowiedzIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "odpowiedzIDSequence"
    )
    private Long odpowiedzID;
    private String odpowiedz;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="uzytkownikID")
    private Uzytkownik uzytkownik;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="pytanieID")
    private Pytanie pytanie;

    public Odpowiedz(Uzytkownik uzytkownik, Pytanie pytanie, String odpowiedz){
        this.uzytkownik = uzytkownik;
        this.pytanie = pytanie;
        this.odpowiedz = odpowiedz;
    }

}
