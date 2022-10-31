package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.appuser.AppUser;

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
    private String name;
    private String accesCode;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="appUserID")
    private AppUser appUser;

    public Test(AppUser appUser, String name, String accesCode){
        this.appUser = appUser;
        this.name = name;
        this.accesCode = accesCode;
    }

}
