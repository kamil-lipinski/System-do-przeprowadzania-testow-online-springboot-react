package kamil.lipinski.testapp.question;

import kamil.lipinski.testapp.test.Test;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity

public class Question {
    @Id
    @SequenceGenerator(
            name = "questionIDSequence",
            sequenceName = "questionIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "questionIDSequence"
    )
    private Long questionID;
    private String question;
    private String a = "";
    private Boolean aCorrect = false;
    private String b = "";
    private Boolean bCorrect = false;
    private String c = "";
    private Boolean cCorrect = false;
    private String d = "";
    private Boolean dCorrect = false;
    private String e = "";
    private Boolean eCorrect = false;
    private String f = "";
    private Boolean fCorrect = false;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="testID")
    private Test test;

}
