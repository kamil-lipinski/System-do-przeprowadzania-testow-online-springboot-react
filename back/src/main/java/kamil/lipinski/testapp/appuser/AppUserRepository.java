package kamil.lipinski.testapp.appuser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    @Query(value = "SELECT * FROM app_user u WHERE u.email =:email", nativeQuery = true)
    AppUser findAppUserByEmail(@Param("email") String email);

}
