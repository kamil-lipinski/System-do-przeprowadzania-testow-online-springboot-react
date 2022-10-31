package kamil.lipinski.testapp.score;

import kamil.lipinski.testapp.appuser.AppUser;
import kamil.lipinski.testapp.test.Test;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Score {
    @Id
    @SequenceGenerator(
            name = "scoreIDSequence",
            sequenceName = "scoreIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "scoreIDSequence"
    )
    private Long scoreID;
    private int score;
    private Boolean isFinished;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="appUserID")
    private AppUser appUser;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="testID")
    private Test test;

    public Score(AppUser appUser, Test test, int score){
        this.appUser = appUser;
        this.test = test;
        this.score = score;
    }
}
