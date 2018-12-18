package rocket.team.interactivelanyard

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.contact_request_fragment.*


class ContactRequestFragment : Fragment() {

    companion object {
        fun newInstance() = ContactRequestFragment()
        private const val TAG = "ContactRequestFragment"
    }

    private val viewModel by lazy {
        ViewModelProviders.of(this).get(ContactRequestViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.contact_request_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        val args = arguments
        if (args != null) {
            val badgeId = args["id"] as String
            Log.d(TAG, "Opened from badge: $badgeId")
            viewModel.getUserDetails(badgeId)
        } else {
            Log.d(TAG, "No badge ID")
        }

        linkRecyclerView.layoutManager = LinearLayoutManager(context)
        val adapter = LinkAdapter(context!!) {
            activity?.startActivity(it)
        }
        linkRecyclerView.adapter = adapter

        viewModel.contactLiveData.observe(this, Observer {
            displayNameTextView.text = it.displayName
            adapter.setLinks(it.links)
            viewModel.requestedLiveData.observe(this, Observer { sent ->
                Toast.makeText(context, if (sent) "Added ${it.displayName} as contact" else "Couldn't add as contact", Toast.LENGTH_LONG).show()
            })
        })

        viewModel.isFetching.observe(this, Observer {
            (activity as MainActivity).setProgressBar(it)
        })
    }

}
