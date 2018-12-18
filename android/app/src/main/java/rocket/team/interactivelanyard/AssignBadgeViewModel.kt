package rocket.team.interactivelanyard

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.functions.FirebaseFunctions
import com.google.firebase.functions.FirebaseFunctionsException

class AssignBadgeViewModel : ViewModel() {
    companion object {
        private const val TAG = "AssignBadgeViewModel"
    }

    val isFetching = MutableLiveData<Boolean>()
    val resultLiveData = MutableLiveData<String>()
    private val functions: FirebaseFunctions by lazy {
        FirebaseFunctions.getInstance()
    }

    fun assignBadgeId(badgeId: String) {
        isFetching.value = true
        Log.d(TAG, "Assigning badgeId: $badgeId")
        val args = mapOf(
             "id" to badgeId
        )
        functions
            .getHttpsCallable("assignBadgeID")
            .call(args)
            .continueWith {
                val result = it.result?.data as HashMap<String, String>
                result
            }
            .addOnCompleteListener {
                isFetching.value = false
                if (it.isSuccessful) {
                    resultLiveData.value = it.result!!["badgeId"]
                } else {
                    Log.d(TAG, "had a boo boo")
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
