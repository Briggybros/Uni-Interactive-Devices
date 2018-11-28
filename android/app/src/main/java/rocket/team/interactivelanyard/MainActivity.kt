package rocket.team.interactivelanyard

import java.io.IOException
import java.io.OutputStream
import java.util.UUID

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {

    private lateinit var btAdapter: BluetoothAdapter
    private lateinit var btSocket: BluetoothSocket
    private lateinit var outStream: OutputStream

    /** Called when the activity is first created.  */
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btAdapter = BluetoothAdapter.getDefaultAdapter()
        checkBTState()

        send_button.setOnClickListener {
            val name = name_edit_text.text.toString()
            val deets = deets_edit_text.text.toString()
            val data = "{" +
                    "\"name\": \"$name\", " +
                    "\"deets\": \"$deets\"" +
                "}"
            val succ = sendData(data)
            if (succ) {
                Toast.makeText(baseContext, "Sent data", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(baseContext, "Could not send data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @Throws(IOException::class)
    private fun createBluetoothSocket(device: BluetoothDevice): BluetoothSocket {
        return device.createRfcommSocketToServiceRecord(MY_UUID)
    }

    public override fun onResume() {
        super.onResume()

        Log.d(TAG, "onResume - try connect")

        // Set up a pointer to the remote node using it's address.
        val device = btAdapter.getRemoteDevice(address)

        // Two things are needed to make a connection:
        //   A MAC address, which we got above.
        //   A Service ID or UUID.  In this case we are using the
        //     UUID for SPP.

        try {
            btSocket = createBluetoothSocket(device)
        } catch (e1: IOException) {
            Log.e(TAG, "Socket create failed " + e1.message)
        }

        // Discovery is resource intensive.  Make sure it isn't going on
        // when you attempt to connect and pass your message.
        btAdapter.cancelDiscovery()

        // Establish the connection.  This will block until it connects.
        Log.d(TAG, "Connecting")
        try {
            btSocket.connect()
            Log.d(TAG, "Connection ok")
        } catch (e: IOException) {
            Log.e(TAG, "Could not connect to socket " + e.message)
        }

        // Create a data stream so we can talk to server.
        Log.d(TAG, "Create Socket")

        try {
            outStream = btSocket.outputStream
        } catch (e: IOException) {
            Log.e(TAG, "Output stream creation failed " + e.message)
        }

    }

    public override fun onPause() {
        super.onPause()

        Log.d(TAG, "In onPause()")

        try {
            outStream.flush()
        } catch (e: IOException) {
            Log.e(TAG, "Could not flush stream " + e.message)
        }

        try {
            btSocket.close()
        } catch (e2: IOException) {
            Log.e(TAG, "Could not close socket " + e2.message)
        }

    }

    private fun checkBTState() {
        // Check for Bluetooth support and then check to make sure it is turned on
        // Emulator doesn't support Bluetooth and will return null
        if (btAdapter.isEnabled) {
            Log.d(TAG, "Bluetooth ON")
        } else {
            //Prompt user to turn on Bluetooth
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(enableBtIntent, 1)
        }
    }

    private fun sendData(message: String): Boolean {
        val msgBuffer = message.toByteArray()

        Log.d(TAG, "Send data: $message")

        try {
            outStream.write(msgBuffer)
        } catch (e: IOException) {
            Log.e(TAG, e.message)
            return false
        }
        return true
    }

    companion object {
        private const val TAG = "bluetooth1"

        // SPP UUID service
        private val MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")

        // MAC-address of Bluetooth module (you must edit this line)
        private const val address = "98:D3:32:31:63:0B"
    }
}