package kamil.lipinski.testapp.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import kamil.lipinski.testapp.uzytkownik.Uzytkownik;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Uzytkownik u = uzytkownikRepository.findUzytkownikByEmail(username);
        List<GrantedAuthority> authorityList = new ArrayList<>();
        return new User(u.getEmail(), u.getHaslo(), authorityList);
    }


    public UserDetails createUserDetails(String username, String password) {
        List<GrantedAuthority> authorityList = new ArrayList<>();
        // authorityList.add(new SimpleGrantedAuthority("USER_ROLE"));
        return new User(username, password, authorityList);
    }
}
