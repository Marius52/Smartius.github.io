let usernameInput = document.getElementById("usernameInput");
let profilesDropdown = document.getElementById("profiles");

let profileData;
let apiRequests = 0;
let apiLimit = 100;

setInterval(function () { apiRequests = 0 }, 300000);

//find profile
async function getProfiles() {

    let username = usernameInput.value;

    profileId = [];

    let uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    jsonData = await uuid.json();
    if (jsonData.id == undefined) {
        alert("Unknown name");
    } else if (apiRequests < apiLimit) {
        uuid = jsonData.id;
        let profiles = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${API_KEY}&uuid=${uuid}`, {
            mode: 'cors'
        });
        let profilesData = await profiles.json();
        if (!profilesData.success) { alert(profilesData.cause); }
        apiRequests++;
        for (let i = 0; i < profilesData.profiles.length; i++) {
            if (profilesData.profiles[i].game_mode == "island") {
                if (apiRequests < apiLimit) {
                    let profileName = profilesData.profiles[i].cute_name;
                    let profileData = await fetch(`https://api.hypixel.net/v2/skyblock/profile?key=${API_KEY}&profile=${profilesData.profiles[i].profile_id}`);
                    apiRequests++;
                    jsonData = await profileData.json();
                    profileId.push(profileName);
                    profileId.push(jsonData);
                } else {
                    alert("API Limit Reached!");
                    break;
                }
            }
        }
        uuidOfUsername = uuid;
        //Remove options from profile picker if any are there
        for (const option of document.querySelectorAll('#profiles > option')) {
            option.remove();
        }

        //Add profiles if they are stranded
        profileData = [];
        for (let i = 0; i < profiles?.length; i += 2) {
            let option = document.createElement("option");
            option.text = profiles[i];
            option.value = i / 2;
            profilesDropdown.add(option);
            profileData.push(profiles[i + 1]);
        }
    } else {
        alert("API Limit Reached!");
    }
    console.log("Currently [apiRequests] is at: " + apiRequests);
}

function swapDivXPTasks(divName) {
    currentlyDisplayedDiv.style.display = "none";
    document.getElementById(divName).style.display = "block";
    currentlyDisplayedDiv = document.getElementById(divName);
}

//Toggle different xp methods within the main tasks
function toggleDiv(divId) {
    let x = document.getElementById(divId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function showData() {
    let data = profileData[profilesDropdown.value].profile;
    showCoreTaskXp(data, uuid);
}