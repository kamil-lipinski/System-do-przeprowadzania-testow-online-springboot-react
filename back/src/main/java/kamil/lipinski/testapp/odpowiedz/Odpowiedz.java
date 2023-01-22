package kamil.lipinski.testapp.odpowiedz;

import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.wynik.Wynik;
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
    private Boolean a = false;
    private Boolean b = false;
    private Boolean c = false;
    private Boolean d = false;
    private Boolean e = false;
    private Boolean f = false;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="pytanieID")
    private Pytanie pytanie;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="wynikID")
    private Wynik wynik;

    public Odpowiedz(Pytanie pytanie, Wynik wynik, int numerPytania){
        this.pytanie = pytanie;
        this.wynik = wynik;
        this.numerPytania = numerPytania;
    }
}
