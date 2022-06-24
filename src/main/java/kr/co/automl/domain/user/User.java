package kr.co.automl.domain.user;

import kr.co.automl.domain.user.dto.SessionUser;
import kr.co.automl.domain.user.exceptions.CannotChangeAdminRoleException;
import kr.co.automl.global.config.security.dto.OAuthAttributes;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Objects;

@Entity
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter(value = AccessLevel.PACKAGE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;
    private String name;
    private String imageUrl;
    private String email;

    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Builder
    User(String name, String imageUrl, String email, Role role) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.email = email;
        this.role = role;
    }

    public static User of(OAuthAttributes oAuthAttributes) {
        return ofDefaultRole(
                oAuthAttributes.name(),
                oAuthAttributes.imageUrl(),
                oAuthAttributes.email()
        );
    }

    static User ofDefaultRole(String name, String imageUrl, String email) {
        return User.builder()
                .name(name)
                .imageUrl(imageUrl)
                .email(email)
                .role(Role.DEFAULT)
                .build();
    }

    public long id() {
        return this.id;
    }

    public SessionUser toSessionUser() {
        return new SessionUser(name, imageUrl, email, role);
    }

    public boolean matchEmail(User user) {
        return user.matchEmail(this.email);
    }

    public boolean matchEmail(String email) {
        return Objects.equals(this.email, email);
    }

    /**
     * 권한 이름을 리턴합니다.
     *
     * @return 권한 이름
     */
    public String getRoleName() {
        return this.role.getName();
    }

    public User update(OAuthAttributes oAuthAttributes) {
        this.name = oAuthAttributes.name();
        this.imageUrl = oAuthAttributes.imageUrl();
        this.email = oAuthAttributes.email();

        return this;
    }

    /**
     * 권한을 변경합니다. 어드민 권한으로는 변경할 수 없습니다.
     * @param role 변경할 권한
     *
     * @throws CannotChangeAdminRoleException 어드민 권한이 주어진경우
     */
    public void changeRoleTo(Role role) {
        if (role.isAdmin()) {
            throw new CannotChangeAdminRoleException();
        }

        this.role = role;
    }
}
