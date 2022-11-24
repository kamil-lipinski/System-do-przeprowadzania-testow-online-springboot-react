package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.uzytkownik.Uzytkownik;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Test {
    @Id
    @SequenceGenerator(
            name = "testIDSequence",
            sequenceName = "testIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "testIDSequence"
    )
    private Long testID;
    private String nazwa;
    private String kodDostepu;
    private int iloscPytan;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="uzytkownikID")
    private Uzytkownik uzytkownik;

    public Test(Uzytkownik uzytkownik, String nazwa, int iloscPytan, String kodDostepu){
        this.uzytkownik = uzytkownik;
        this.nazwa = nazwa;
        this.iloscPytan = iloscPytan;
        this.kodDostepu = kodDostepu;
    }

}
