package kamil.lipinski.testapp.pula;

import kamil.lipinski.testapp.uzytkownik.Uzytkownik;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Pula {
    @Id
    @SequenceGenerator(
            name = "pulaIDSequence",
            sequenceName = "pulaIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "pulaIDSequence"
    )
    private Long pulaID;
    private String nazwa;
    private boolean czyZarchiwizowana = false;
    private int iloscPytan = 0;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="uzytkownikID")
    private Uzytkownik uzytkownik;

    public Pula(Uzytkownik uzytkownik, String nazwa){
        this.uzytkownik = uzytkownik;
        this.nazwa = nazwa;
    }

}
