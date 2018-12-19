package rocket.team.interactivelanyard

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.contact_list_item.view.*

class ContactsAdapter(
        private val context: Context
): RecyclerView.Adapter<ContactsViewHolder>() {
    companion object {
        private const val TAG = "ContactsAdapter"
    }
    private var contacts: List<AmulinkContact>? = null

    override fun getItemCount(): Int = contacts?.size ?: 0

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ContactsViewHolder {
        return ContactsViewHolder(LayoutInflater.from(context).inflate(R.layout.contact_list_item, parent, false))
    }

    override fun onBindViewHolder(holder: ContactsViewHolder, position: Int) {
        val contact = contacts!![position]
        holder.bind(contact)
    }

    fun setContacts(contacts: List<AmulinkContact>) {
        this.contacts = contacts
        notifyItemRangeChanged(0, contacts.size)
    }
}

class ContactsViewHolder(private val view: View): RecyclerView.ViewHolder(view) {
    companion object {
        private const val TAG = "ContactsViewHolder"
    }
    fun bind(item: AmulinkContact) = with(view) {
        contactNameTextView.text = item.displayName
        setOnClickListener {
            Log.d(TAG, "Helloooooooo")
        }
    }
}