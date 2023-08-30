import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { redirect } from 'react-router-dom';

import { sendFileToIPFS, sendJSONToIPFS } from '../../apis/piniata';

import AccountContext from '../../context/AccountContext';

import contractaddress from '../../contract-data/ERC721CoA-address.json';
import contractabi from '../../contract-data/ERC721CoA.json';



export default function CreateCoA() {

    const { acc } = useContext(AccountContext);

    // message
    const [msg, setMsg] = useState('');

    // parameters
        // immage data
    const [img, setImg] = useState(null);
    const [fileName, setFileName] = useState('No set image file name');
    const [imgFile, setImgFile] = useState(null);
        // object type
    const [type, setType] = useState('');
        // work title
    const [title, setTitile] = useState('');
        // artist name
    const [artist, setArtist] = useState('');
        // statement of authentisity
    const [description, setDescription] = useState('');
        // date
    const [date, setDate] = useState({});
        // dimensions
    const [length, setLength] = useState({});
    const [heigth, setHeight] = useState({});
    const [unit, setUnit] = useState({});
        // medium
    const [medium, setMedium] = useState({});
        // eddition
    const [edType, setEdType] = useState({});
    const [edCuantity, setEdCuantity] = useState({});
    const [edNumber, setEdNumber] = useState({});
        // issuer
    const [iName, setIName] = useState('');
    const [iType, setIType] = useState('');
            // signature data
    const [iSig, setISig] = useState(null);
    const [iSigName, setISigName] = useState('No issuer signature name');
    const [iSigFile, setISigFile] = useState(null);

    // auth 
    const [auth, setAuth] = useState('');

    async function uploadMetadataIPFS() {

        // upload img to ipfs & retrive cid
        const image = await sendFileToIPFS(imgFile);

        // set up dimensions
        let dValue = [];
        dValue.push(length);
        dValue.push(heigth);
        dValue.push(unit);

        const dimensions = {
            display_type: "dimensions",
            trait_type: "Dimensions",
            value: dValue
        }

        // set up edition
        let edValue = [];
        edValue.push(edType);
        if(edCuantity.value){
            edValue.push(edCuantity);
        }
        if(edNumber.value){
            edValue.push(edNumber);
        }

        const edition = {
            display_type: "edition",
            trait_type: "Edition",
            value: edValue
        }

        // create propertyes
        let properties = [];
        properties.push(date);
        properties.push(dimensions);
        properties.push(medium);
        properties.push(edition);

        // upload isuer signature to ipfs
        let signature = await sendFileToIPFS(iSigFile);
        
        // create issuer
        const issuer ={
            name: `${iName}`,
            trait_type: `${iType}`,
            address: `${acc.account}`,
            signature: signature
        }

        let issuers = [];
        issuers.push(issuer);

        // create metadata obj
        const metadata = {}
        metadata.type = type;
        metadata.title = title;
        metadata.artist = artist;
        metadata.image = image;
        metadata.description = description;
        metadata.properties = properties;
        metadata.issuers = issuers;

        // upload metadata tu ipfs
        const metadataURI = await sendJSONToIPFS(metadata, `metadata-${artist.replaceAll(' ', '')}-${title.replaceAll(' ', '')}.json`);
            // console.log('metadata uri:', metadataURI)

        // upload artwork fingerprint to ipfs
        const authentication = {
            type: "authentification",
            properties: [
                {
                    trait_type: "Description",
                    value: auth
                }
            ]
        }

        let authURI = await sendJSONToIPFS(authentication, `auth-${artist.replaceAll(' ', '')}-${title.replaceAll(' ', '')}.json`);
            // console.log('auth uri:',authURI);
        
        return {metadataURI, authURI};
    }

    async function mintNFT(e) {
        e.preventDefault();

        // mint nft with relevant data
        try{
            // provide uploading message
            setMsg('Plis wait, uploading will take upto 5 minutes');

            // obtain information tu upload
                // url - metadata & authentification
            const data = await uploadMetadataIPFS();
                console.log('data:',data);
                // get web provider - metamask
            const provider = await new ethers.BrowserProvider(window.ethereum);

                // get signer
            const signer = await provider.getSigner();

                // set up proxy contract
            const coacontract = new ethers.Contract(contractaddress.address, contractabi.abi, signer);
            
            // verify & grant roll
                // obtain the role type
            const roleMint = await coacontract.MINTER_ROLE();
            
                // verify that user has roll - if not grant roll w admin account
            const hasRoll = await coacontract.hasRole(roleMint, acc.account);
            
            if(hasRoll && data.metadataURI !== undefined && data.authURI !== undefined){
                // mint token
                const mint = await coacontract.safeMintTo(acc.account, data.metadataURI, data.authURI, artist, title);
                await mint.wait();
            } else {
                setMsg('could not create certificate');
            }

            // alert and clean parameters
            alert('CoA creation wass succesfull');
            setMsg('');

            // redirect user to desired url : window.location.replace("/") || reactRowterDOM {return redirect('/')}
            window.location.replace("/");
            // return redirect('/');
            
        } catch (error) {
            console.log('mint error: ',error);
            alert("create error: "+error);
        }
    }

    function changeMsg(){
        setMsg('');
    }

    return (
        <div>
            <h2>Create Certificate</h2>
            <form className='coa-form'>
                {/* --- object image --- */}
                <label 
                    className='form-img'
                    onClick={() => document.querySelector('.input-field')}
                >
                    <input type="file" accept='image/*' className='input-field' hidden 
                        onChange={({ target: {files} }) => {
                            if(files[0]){
                                setImgFile(files[0]) && setFileName(files[0].name)
                                console.log('uploaded img:', files)

                                setImg(URL.createObjectURL(files[0]))
                                console.log('image url:', URL.createObjectURL(files[0]))
                            }
                        }}
                    />

                    { img ? ( 
                            <img src={img} alt={fileName} />
                        ) : (
                            <p>*uppload image</p>
                    )}
                </label>
                
                {/* --- parameters --- */}
                <div className='form-param'>
                        {/* type */}
                    <div>
                        <label htmlFor='type'>*Object type</label>
                        <input type="text" required name='type' placeholder='object type' 
                            onChange={e => setType(e.target.value)}
                            value={type}
                        />
                    </div>
                        {/* title */}
                    <div>
                        <label htmlFor='title'>*Work title</label>
                        <input type="text" required name='title' placeholder='object title' 
                            onChange={e => setTitile(e.target.value)}
                            value={title}
                        />
                    </div>
                        {/* artist */}
                    <div>
                        <label htmlFor='artist'>*Artist</label>
                        <input type="text" required name='artist' placeholder='artist name' 
                            onChange={e => setArtist(e.target.value)}
                            value={artist}
                        />
                    </div>
                        {/* date */}
                    <div>
                        <label htmlFor='date'>*Completion</label>
                        <input type="date" required name='date' 
                            onChange={e => setDate({...date, 
                                display_type: 'date', 
                                trait_type: 'Creation Date', 
                                value: Math.floor(new Date(e.target.value).valueOf())
                            })}
                        />
                    </div>
                        {/* dimensions */}
                    <section>
                        <label htmlFor='dimensions'>*Dimensions</label>
                        {/* length */}
                        <div>
                            <label htmlFor="length">*length</label>
                            <input type="number" required name='dimension-length' placeholder='length' 
                                onChange={e => setLength({...length,
                                    trait_type: "length",
                                    value: e.target.value
                                })}
                            />
                        </div>
                        {/* height */}
                        <div>
                            <label htmlFor="heigth">*heigth</label>
                            <input type="number" required name='dimension-heigth' placeholder='heigth' 
                                onChange={e => setHeight({...heigth,
                                    trait_type: "height",
                                    value: e.target.value
                                })}
                            />
                        </div>
                        {/* unit */}
                        <div>
                            <label htmlFor="unit">*unit</label>
                            <select required name='dimension-unit' 
                                onChange={e => setUnit({...unit,
                                    trait_type: 'unit',
                                    value: `${e.target.value}`
                                })}
                            >
                                <option value="">select</option>
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                    </section>
                        {/* medium */}
                    <div>
                        <label htmlFor="medium">*Medium</label>
                        <input type="text" required name='medium' placeholder='medium' 
                            onChange={e => setMedium({...medium, 
                                trait_type: 'Medium',
                                value: `${e.target.value}`
                            })}
                        />
                    </div>
                        {/* edition */}
                    <section>
                        <label htmlFor="edition">*Edition</label>
                        {/* edition type */}
                        <div>
                            <label htmlFor="eddition-type">*type</label>
                            <input type="text" required name='edition' placeholder='edition' 
                                onChange={e => setEdType({...edType,
                                    trait_type: `${e.target.value}`,
                                    value: ""
                                })}
                            />
                        </div>
                        {/* edition cuantity */}
                        <div>
                            <label htmlFor="eddition-cuantity">cuantity</label>
                            <input type="number" name='cuantity' placeholder='cuantity' 
                                onChange={e => setEdCuantity({
                                    trait_type: "cuantity",
                                    value: e.target.value
                                })}
                                value={edCuantity.value}
                            />
                        </div>
                        {/* edition number */}
                        <div>
                            <label htmlFor="eddition-number">number</label>
                            <input type="number" name='number' placeholder='number' 
                                onChange={e => setEdNumber({
                                    trait_type:'number',
                                    value: e.target.value
                                })}
                                value={edNumber.value}
                            />
                        </div>
                    </section>
                </div>
                
                {/* --- statement of auth --- */}
                <div className='form-statement'>
                        <label htmlFor='statement'>*Statement of Authenticity</label>
                        <textarea name='statement' required 
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                        ></textarea>
                </div>
                
                {/* --- authentication fingerprint --- */}
                <div className='form-fingerprint'>
                        <label htmlFor='fingerprint'>*Authentification Fingerprint</label>
                        <textarea name='fingerprint' required
                            onChange={e => setAuth(e.target.value)}
                            value={auth}
                        ></textarea>
                </div>

                {/* --- issuer --- */}
                <div className='form-issuers'>
                    <label htmlFor="issuers">*Issuer</label>
                    <div className='issuer-info'>
                        {/* issuer signature */}
                        <label 
                            className='form-signature'
                            onClick={() => document.querySelector('.signature-field')}
                            >
                            <input type="file" accept='image/*' className='signature-field' hidden 
                                onChange={({ target: {files} }) => {
                                    if(files[0]){
                                        setISigFile(files[0]) && setISigName(files[0].name)
                                        console.log('uploaded signature:', files)
        
                                        setISig(URL.createObjectURL(files[0]))
                                        console.log('signature url:', URL.createObjectURL(files[0]))
                                    }
                                }}
                                />

                            { iSig ? ( 
                                <img src={iSig} alt={iSigName} />
                                ) : (
                                    <p>uppload image</p>
                                    )}
                        </label>
                        {/* issuer data */}
                        <section>
                            {/* issuer name */}
                            <div>
                                <label htmlFor="issuer-name">*Name</label>
                                <input type="text" required name='issuer-name' placeholder='issuer name' 
                                    onChange={e => setIName(e.target.value)}
                                    value={iName}
                                />
                            </div>
                            {/* issuer type */}
                            <div>
                                <label htmlFor="issuer-type">*Type</label>
                                <input type="text" required name='issuer-type' placeholder='issuer type'
                                    onChange={e => setIType(e.target.value)}
                                    value={iType}
                                />
                            </div>
                        </section>
                    </div>
                </div>
                
                { imgFile && type !== '' && title !== '' && artist !== '' && description !== '' && date !== {} && length !== {} && heigth !== {} && unit !== {} && medium !== {} && edType !== {} && auth !== '' && iName !== '' && iType !== '' && iSigFile && acc.account
                    ? <button onClick={mintNFT} >Create Certificate</button>
                    : <p>Fill all elemets marked with an *asterix </p>
                }

            </form>

            { msg !== '' && 
                <div className='overlay'>
                    <div className="pupup">
                        <div>
                            <h3>Atencion</h3>
                            <button onClick={changeMsg}>x</button>
                        </div>
                        <p>{msg}</p>
                        {/* <NavLink to="/">Return Home</NavLink> */}
                    </div>
                </div>
            }
        </div>
    )
}