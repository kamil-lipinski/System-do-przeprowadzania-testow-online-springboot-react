package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.appuser.AppUser;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.lang.NonNull;

import javax.persistence.*;

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

    public Test(){}

    public Test(AppUser appUser, String name, String accesCode){
        this.appUser = appUser;
        this.name = name;
        this.accesCode = accesCode;
    }

    public Long getTestID() {
        return testID;
    }

    public void setTestID(Long testID) {
        this.testID = testID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccesCode() {
        return accesCode;
    }

    public void setAccesCode(String accesCode) {
        this.accesCode = accesCode;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }
}
