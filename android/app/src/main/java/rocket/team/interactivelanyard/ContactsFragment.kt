package rocket.team.interactivelanyard

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.contacts_fragment.*


class ContactsFragment : Fragment() {

    companion object {
        private const val TAG = "ContactsFragment"
        fun newInstance() = ContactsFragment()
    }

    private val viewModel by lazy {
        ViewModelProviders.of(this).get(ContactsViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.contacts_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        viewModel.loadContacts()

        contactsRecyclerView.layoutManager = LinearLayoutManager(context)
        val contactsAdapter = ContactsAdapter(context!!)
        contactsRecyclerView.adapter = contactsAdapter

        contactsSwipeRefreshLayout.setOnRefreshListener {
            Log.d(TAG, "Refreshing")
            viewModel.loadContacts()
        }

        viewModel.isRefreshingContactsLiveData.observe(this, Observer {
            contactsSwipeRefreshLayout.isRefreshing = it
        })

        viewModel.contactsLiveData.observe(this, Observer {
            contactsAdapter.setContacts(it)
        })
    }

}
