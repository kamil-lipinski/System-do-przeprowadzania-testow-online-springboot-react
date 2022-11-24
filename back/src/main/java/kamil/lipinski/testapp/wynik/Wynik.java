package kamil.lipinski.testapp.wynik;

import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.test.Test;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Wynik {
    @Id
    @SequenceGenerator(
            name = "wynikIDSequence",
            sequenceName = "wynikIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "wynikIDSequence"
    )
    private Long wynikID;
    private int wynik;
    private Boolean czyUkonczono = false;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="uzytkownikID")
    private Uzytkownik uzytkownik;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name="testID")
    private Test test;

    public Wynik(Uzytkownik uzytkownik, Test test){
        this.uzytkownik = uzytkownik;
        this.test = test;
    }
}
