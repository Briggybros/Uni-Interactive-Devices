package rocket.team.interactivelanyard


import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.recyclerview.widget.LinearLayoutManager
import kotlinx.android.synthetic.main.activity_main.*
import rocket.team.interactivelanyard.viewmodel.MainViewModel


class MainActivity : AppCompatActivity() {

    private lateinit var rvAdapter: BtDeviceAdapter
    private val viewModel: MainViewModel by lazy {
        ViewModelProviders.of(this).get(MainViewModel::class.java)
    }

    /** Called when the activity is first created.  */
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        checkBTState()

        btRecyclerView.layoutManager = LinearLayoutManager(this)
        rvAdapter = BtDeviceAdapter(this) {
            viewModel.stopBluetoothScanning()
            Toast.makeText(this, "Connecting to ${it.name}", Toast.LENGTH_SHORT).show()
            viewModel.connectBluetooth(it.address)
        }
        btRecyclerView.adapter = rvAdapter

        scanButton.setOnClickListener {
            // TODO: Show spinner or something
            viewModel.getBluetoothDevices().observe(this, Observer<Set<DeviceItem>> {items ->
                Log.d(TAG, "items are $items")
                if (items.isNotEmpty()) {
                    rvAdapter.setItems(items)
                }
            })
        }

        sendButton.setOnClickListener {
            val name = nameEditText.text.toString()
            val deets = deetsEditText.text.toString()
            val data = "{" +
                    "\"name\": \"$name\", " +
                    "\"deets\": \"$deets\"" +
                "}"
            val succ = viewModel.sendData(data)
            if (succ) {
                Toast.makeText(baseContext, "Sent data", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(baseContext, "Could not send data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    public override fun onResume() {
        super.onResume()
    }

    public override fun onPause() {
        super.onPause()

        Log.d(TAG, "In onPause()")
    }

    private fun checkBTState() {
        // Check for Bluetooth support and then check to make sure it is turned on
        // Emulator doesn't support Bluetooth and will return null
        if (BluetoothAdapter.getDefaultAdapter().isEnabled) {
            Log.d("BluetoothRepository", "Bluetooth ON")
        } else {
            //Prompt user to turn on Bluetooth
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(enableBtIntent, 1)
        }
    }

    companion object {
        private const val TAG = "bluetooth1"
    }
}