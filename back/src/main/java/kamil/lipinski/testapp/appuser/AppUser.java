package kamil.lipinski.testapp.appuser;

import javax.persistence.*;

@Entity
public class AppUser {
    @Id
    @SequenceGenerator(
            name = "appUserIDSequence",
            sequenceName = "appUserIDSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "appUserIDSequence"
    )
    private Long userID;
    private String name;
    private String surname;
    private String email;
    private String password;
    private boolean isTeacher;

    public AppUser(){}

    public AppUser(String name, String surname, String email, String password, boolean isTeacher) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.isTeacher = isTeacher;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isTeacher() {
        return isTeacher;
    }

    public void setTeacher(boolean teacher) {
        isTeacher = teacher;
    }
}
