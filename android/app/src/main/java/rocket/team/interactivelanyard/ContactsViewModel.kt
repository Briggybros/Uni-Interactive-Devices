package rocket.team.interactivelanyard

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.functions.FirebaseFunctions
import java.lang.Thread.sleep

class ContactsViewModel : ViewModel() {
    companion object {
        private const val TAG = "ContactsViewModel"
    }

    val functions by lazy {
        FirebaseFunctions.getInstance()
    }
    val contactsLiveData by lazy {
        MutableLiveData<List<AmulinkContact>>()
    }
    val isRefreshingContactsLiveData by lazy {
        MutableLiveData<Boolean>()
    }

    fun loadContacts() {
        isRefreshingContactsLiveData.value = true
        functions.getHttpsCallable("getContacts")
                .call()
                .continueWith {
                    it.result?.data as HashMap<String, Any>
                }
                .addOnCompleteListener {
                    if (it.isSuccessful && it.result != null) {
                        val entries = (it.result!!["contacts"] as HashMap<String, HashMap<String, Any>>).values.toList()
                        Log.d(TAG, "Contacts: $entries")
                        val contacts = entries.map {
                            AmulinkContact(
                                    it["displayName"] as String,
                                    (it["links"] as List<HashMap<String, String>>).map { Amulinks(it["name"]!!, it["link"]!!) },
                                    it["isContact"] as Boolean
                            )
                        }
                        contactsLiveData.value = contacts
                        isRefreshingContactsLiveData.value = false
                    }
                }
    }
}
