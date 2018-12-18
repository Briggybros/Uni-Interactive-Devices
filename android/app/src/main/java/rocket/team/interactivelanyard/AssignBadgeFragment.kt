package rocket.team.interactivelanyard

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import kotlinx.android.synthetic.main.assign_badge_fragment.*


class AssignBadgeFragment : Fragment() {

    companion object {
        fun newInstance() = AssignBadgeFragment()
        private const val TAG = "AssignBadgeFragment"
    }

    private val viewModel: AssignBadgeViewModel by lazy {
        ViewModelProviders.of(this).get(AssignBadgeViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.assign_badge_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        assignButton.setOnClickListener {
            val badgeId = badgeIdEditText.text.toString()
            viewModel.assignBadgeId(badgeId)
        }

        viewModel.isFetching.observe(this, Observer<Boolean> {
            Log.d(TAG, "Is Fetching: $it")
            assignButton.isEnabled = !it
            Log.d(TAG, "Activity: ${activity.toString()}")
            (activity as MainActivity).toggleProgressBar()
        })

        viewModel.resultLiveData.observe(this, Observer<String> {
            Log.d(TAG, "Result: $it")
            findNavController().navigate(R.id.action_navigation_setup_to_device_list)
        })
    }

}
