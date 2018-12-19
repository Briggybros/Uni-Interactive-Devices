package rocket.team.interactivelanyard

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import kotlinx.android.synthetic.main.send_data_fragment.*
import rocket.team.interactivelanyard.viewmodel.MainViewModel

class SendDataFragment : Fragment() {
    companion object {
        fun newInstance() = ContactRequestFragment()
        private const val TAG = "SendDataFragment"
    }

    private lateinit var backgroundColorVal: String
    private lateinit var textColorVal: String
    private lateinit var emojiVal: String
    private lateinit var borderVal: String
    private val viewModel: MainViewModel by lazy {
        ViewModelProviders.of(activity!!).get(MainViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.send_data_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        backgroundColorSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {
                backgroundColorVal = "WHITE"
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
                backgroundColorVal = (parent?.getItemAtPosition(pos) as String).toUpperCase()
            }
        }

        textColorSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {
                textColorVal = "WHITE"
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
                textColorVal = (parent?.getItemAtPosition(pos) as String).toUpperCase()
            }
        }

        emojiSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            private val keys = resources.getStringArray(R.array.emojis_keys)
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
                emojiVal = keys[pos]
            }

            override fun onNothingSelected(p0: AdapterView<*>?) {
                emojiVal = keys[0]
            }
        }

        borderSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {
                borderVal = "1"
            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
                borderVal = (parent?.getItemAtPosition(pos) as String).toUpperCase()
            }
        }

        sendButton.setOnClickListener {
            val name = nameEditText.text.toString()
            val deets = deetsEditText.text.toString()
            val data = "{" +
                    "\"name\": \"$name\", " +
                    "\"deets\": \"$deets\", " +
                    "\"backgroundColor\": \"$backgroundColorVal\", " +
                    "\"textColor\": \"$textColorVal\", " +
                    "\"emoji\": \"$emojiVal\", " +
                    "\"border\": \"$borderVal\"" +
                    "}"
            sendButton.isEnabled = false
            (activity as MainActivity).setProgressBar(true)
            val succ = viewModel.sendData(data)
            sendButton.isEnabled = true
            (activity as MainActivity).setProgressBar(false)
            if (succ) {
                Toast.makeText(context, "Sent data", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Could not send data", Toast.LENGTH_SHORT).show()
            }
        }
    }
}