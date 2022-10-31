package kamil.lipinski.testapp.answer;

import kamil.lipinski.testapp.appuser.AppUser;
import kamil.lipinski.testapp.question.Question;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Answer {
    @Id
    @SequenceGenerator(
            name = "answerIDSequence",
            sequenceName = "answerIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "answerIDSequence"
    )
    private Long answerID;
    private String answer;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="appUserID")
    private AppUser appUser;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="questionID")
    private Question question;

    public Answer(AppUser appUser, Question question, String answer){
        this.appUser = appUser;
        this.question = question;
        this.answer = answer;
    }

}
