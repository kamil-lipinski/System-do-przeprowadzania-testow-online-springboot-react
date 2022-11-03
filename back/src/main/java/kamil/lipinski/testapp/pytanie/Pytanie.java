package kamil.lipinski.testapp.pytanie;

import kamil.lipinski.testapp.test.Test;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity

public class Pytanie {
    @Id
    @SequenceGenerator(
            name = "pytanieIDSequence",
            sequenceName = "pytanieIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "pytanieIDSequence"
    )
    private Long pytanieID;
    private String tresc;
    private String a = "";
    private Boolean aPoprawne = false;
    private String b = "";
    private Boolean bPoprawne = false;
    private String c = "";
    private Boolean cPoprawne = false;
    private String d = "";
    private Boolean dPoprawne = false;
    private String e = "";
    private Boolean ePoprawne = false;
    private String f = "";
    private Boolean fPoprawne = false;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="testID")
    private Test test;

}
