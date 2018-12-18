package rocket.team.interactivelanyard

import androidx.lifecycle.ViewModel;
import com.google.firebase.auth.FirebaseAuth

class SettingsViewModel : ViewModel() {
    fun signOut() {
        val auth = FirebaseAuth.getInstance()
        auth.signOut()
    }
}
