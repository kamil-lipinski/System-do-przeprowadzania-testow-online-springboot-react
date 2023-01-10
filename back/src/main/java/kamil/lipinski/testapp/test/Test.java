package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.pula.Pula;
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
    private String data;
    private int czas;
    private int iloscPytan;
    private String kodDostepu;
    private String status = "zaplanowany";
    private int iloscZapisanych = 0;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="pulaID")
    private Pula pula;

    public Test(Pula pula, String nazwa, String data, int czas, int iloscPytan, String kodDostepu){
        this.pula = pula;
        this.nazwa = nazwa;
        this.data = data;
        this.czas = czas;
        this.iloscPytan = iloscPytan;
        this.kodDostepu = kodDostepu;
    }

}
