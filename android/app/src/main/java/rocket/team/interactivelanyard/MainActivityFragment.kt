package rocket.team.interactivelanyard

import android.bluetooth.BluetoothAdapter
import android.content.Intent
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import rocket.team.interactivelanyard.viewmodel.MainViewModel
import kotlinx.android.synthetic.main.main_activity_fragment.*

class MainActivityFragment : Fragment() {

    companion object {
        fun newInstance() = MainActivityFragment()
        private const val TAG = "MainActivityFragment"
    }

    private lateinit var backgroundColorVal: String
    private lateinit var textColorVal: String
    private lateinit var emojiVal: String
    private lateinit var borderVal: String

    private lateinit var rvAdapter: BtDeviceAdapter
    private val viewModel: MainViewModel by lazy {
        ViewModelProviders.of(this).get(MainViewModel::class.java)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.main_activity_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        btRecyclerView.layoutManager = LinearLayoutManager(context)
        rvAdapter = BtDeviceAdapter(context!!) {
            viewModel.stopBluetoothScanning()
            Toast.makeText(context, "Connecting to ${it.name}", Toast.LENGTH_SHORT).show()
            viewModel.connectBluetooth(it.address) {
//                findNavController().navigate(R.id.action_device_list_to_send_data)
            }
        }
        btRecyclerView.adapter = rvAdapter

        checkBTState()
        viewModel.bluetoothDevices.observe(this, Observer { items ->
            Log.d(TAG, "items are $items")
            if (items.isNotEmpty()) {
                rvAdapter.setItems(items)
            }
        })
        viewModel.getBluetoothDevices()

        scanButton.setOnClickListener {
            viewModel.getBluetoothDevices()
        }

        viewModel.isScanning.observe(this, Observer {
            (activity as MainActivity).setProgressBar(it)
        })


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
            val succ = viewModel.sendData(data)
            if (succ) {
                Toast.makeText(context, "Sent data", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Could not send data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun checkBTState() {
        // Check for Bluetooth support and then check to make sure it is turned on
        // Emulator doesn't support Bluetooth and will return null
        if (BluetoothAdapter.getDefaultAdapter().isEnabled) {
            Log.d(TAG, "Bluetooth ON")
        } else {
            //Prompt user to turn on Bluetooth
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(enableBtIntent, 1)
        }
    }
}
