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
    private int numerPytania;
    private Boolean a;
    private Boolean b;
    private Boolean c;
    private Boolean d;
    private Boolean e;
    private Boolean f;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="uzytkownikID")
    private Uzytkownik uzytkownik;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="pytanieID")
    private Pytanie pytanie;

    public Odpowiedz(Uzytkownik uzytkownik, Pytanie pytanie, int numerPytania){
        this.uzytkownik = uzytkownik;
        this.pytanie = pytanie;
        this.numerPytania = numerPytania;
    }

}
