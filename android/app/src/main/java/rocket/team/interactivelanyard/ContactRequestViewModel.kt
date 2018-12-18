package rocket.team.interactivelanyard

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel;
import com.google.firebase.functions.FirebaseFunctions
import com.google.firebase.functions.FirebaseFunctionsException

class ContactRequestViewModel : ViewModel() {
    companion object {
        private const val TAG = "ContactRequestViewModel"
    }

    val isFetching = MutableLiveData<Boolean>()
    val contactLiveData = MutableLiveData<AmulinkContact>()
    val requestedLiveData = MutableLiveData<Boolean>()
    private val functions: FirebaseFunctions by lazy {
        FirebaseFunctions.getInstance()
    }

    fun getUserDetails(badgeId: String) {
        isFetching.value = true
        val args = mapOf(
                "id" to badgeId
        )
        functions.getHttpsCallable("getUserByBadgeID")
                .call(args)
                .continueWith {
                    val result = it.result?.data as HashMap<String, String>
                    result
                }
                .addOnCompleteListener {
                    if (it.isSuccessful) {
                        val userId = it.result!!["uid"]
                        functions.getHttpsCallable("getUserByID")
                                .call(mapOf(
                                        "uid" to userId
                                ))
                                .continueWith {
                                    val result = it.result?.data as HashMap<String, Any>
                                    result
                                }
                                .addOnCompleteListener {
                                    if (it.isSuccessful) {
                                        val result = it.result
                                        if (result != null) {
                                            val contact = AmulinkContact(
                                                    result["displayName"] as  String,
                                                    (result["links"] as List<HashMap<String, Any>>).map { link -> Amulinks(link["name"] as String, link["link"] as String) },
                                                    result["isContact"] as Boolean
                                            )
                                            contactLiveData.value = contact
                                            functions.getHttpsCallable("addContact")
                                                    .call(mapOf(
                                                            "contactId" to userId
                                                    ))
                                                    .addOnCompleteListener {
                                                        if (it.isSuccessful) {
                                                            isFetching.value = false
                                                            requestedLiveData.value = true
                                                        } else {
                                                            isFetching.value = false
                                                            requestedLiveData.value = false
                                                            Log.d(TAG, "had a boo boo sending contact")
                                                            val e = it.exception
                                                            Log.d(TAG, e.toString())
                                                            if (e is FirebaseFunctionsException) {
                                                                val code = e.code
                                                                val details = e.details
                                                                Log.e(TAG, code.toString())
                                                                Log.e(TAG, details.toString())
                                                            }
                                                        }
                                                    }
                                        }
                                    } else {
                                        isFetching.value = false
                                        Log.d(TAG, "had a boo boo getting user")
                                        val e = it.exception
                                        Log.d(TAG, e.toString())
                                        if (e is FirebaseFunctionsException) {
                                            val code = e.code
                                            val details = e.details
                                            Log.e(TAG, code.toString())
                                            Log.e(TAG, details.toString())
                                        }
                                    }
                                }
                    } else {
                        isFetching.value = false
                        Log.d(TAG, "had a boo boo getting uid")
                        val e = it.exception
                        Log.d(TAG, e.toString())
                        if (e is FirebaseFunctionsException) {
                            val code = e.code
                            val details = e.details
                            Log.e(TAG, code.toString())
                            Log.e(TAG, details.toString())
                        }
                    }
                }
    }
}
